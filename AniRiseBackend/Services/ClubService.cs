using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Data;
using AniRiseBackend.Models;
using Microsoft.EntityFrameworkCore;
using AniRiseBackend.Dtos;
using AniRiseBackend.Contracts;

namespace AniRiseBackend.Services;


public class ClubService
{
    private readonly AppDbContext _db;

    public ClubService(AppDbContext db)
    {
        _db = db;
    }

    // MAP: Club → ClubSearchDTO
    private static ClubSearchDTO MapToSearchDTO(Club c) => new ClubSearchDTO
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        ImageUrl = c.Media.Select(m => m.Media.Url).FirstOrDefault(),
        MembersCount = c.Members.Count,
        CreatedAt = c.CreatedAt
    };

    private static ClubDetailDTO MapToDetailDTO(Club c, Guid currentUserId)
    {
        var isMember = c.Members.Any(m => m.UserId == currentUserId);
        var isAdmin = c.AdminId == currentUserId;

        return new ClubDetailDTO
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            CreatedAt = c.CreatedAt,
            AdminName = c.Admin.Username,
            ImageUrl = c.Media.Select(m => m.Media.Url).FirstOrDefault(),

            MembersCount = c.Members.Count,
            Members = c.Members.Select(m => m.User.Username).ToList(),

            Membership = new ClubMembershipDTO
            {
                IsMember = isMember,
                IsAdmin = isAdmin
            }
        };
    }

    public async Task<List<ClubSearchDTO>> GetAllAsync()
    {
        var clubs = await _db.Clubs
            .AsNoTracking()
            .Select(c => new ClubSearchDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.Media.OrderBy(cm => cm.MediaId)
                            .Select(cm => cm.Media.Url)
                            .FirstOrDefault(),
                MembersCount = c.Members.Count,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return clubs;
    }


    public async Task<List<ClubSearchDTO>> GetAllFilteredAsync(ClubRequestParams query)
    {
        var clubsQuery = _db.Clubs
            .Include(c => c.Members)
            .Include(c => c.Media).ThenInclude(cm => cm.Media)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Name))
        {
            clubsQuery = clubsQuery.Where(c => c.Name.Contains(query.Name));
        }

        clubsQuery = query.SortBy.ToLower() switch
        {
            "name" => query.SortOrder.ToLower() == "asc" 
                        ? clubsQuery.OrderBy(c => c.Name) 
                        : clubsQuery.OrderByDescending(c => c.Name),
            "memberscount" => query.SortOrder.ToLower() == "asc" 
                        ? clubsQuery.OrderBy(c => c.Members.Count) 
                        : clubsQuery.OrderByDescending(c => c.Members.Count),
            _ => query.SortOrder.ToLower() == "asc" 
                        ? clubsQuery.OrderBy(c => c.CreatedAt) 
                        : clubsQuery.OrderByDescending(c => c.CreatedAt),
        };

        if (query.Offset > 0)
            clubsQuery = clubsQuery.Skip(query.Offset);
        else if (query.Page > 0 && query.Limit > 0)
            clubsQuery = clubsQuery.Skip((query.Page - 1) * query.Limit);

        if (query.Limit > 0)
            clubsQuery = clubsQuery.Take(query.Limit);

        var clubs = await clubsQuery.ToListAsync();

        return clubs.Select(c => new ClubSearchDTO
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ImageUrl = c.Media.Select(m => m.Media.Url).FirstOrDefault(),
            MembersCount = c.Members.Count,
            CreatedAt = c.CreatedAt
        }).ToList();
    }


    public async Task<ClubDetailDTO?> GetByIdAsync(long id, Guid currentUserId)
    {
        var club = await _db.Clubs
            .Include(c => c.Admin)
            .Include(c => c.Members)
                .ThenInclude(uc => uc.User)
            .Include(c => c.Media)
                .ThenInclude(cm => cm.Media)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (club == null)
            return null;

        return MapToDetailDTO(club, currentUserId);
    }

    public async Task<List<ClubDetailDTO>> GetUserClubsAsync(Guid userId)
    {
        var clubs = await _db.UserClubs
            .Where(uc => uc.UserId == userId)
            .Include(uc => uc.Club)
                .ThenInclude(c => c.Media)
                    .ThenInclude(cm => cm.Media)
            .Include(uc => uc.Club)
                .ThenInclude(c => c.Admin)
            .Select(uc => new ClubDetailDTO
            {
                Id = uc.Club.Id,
                Name = uc.Club.Name,
                Description = uc.Club.Description,
                CreatedAt = uc.Club.CreatedAt,
                AdminName = uc.Club.Admin.Username,
                ImageUrl = uc.Club.Media.Select(m => m.Media.Url).FirstOrDefault(),
                MembersCount = uc.Club.Members.Count,
                Members = uc.Club.Members.Select(m => m.User.Username).ToList(),
                Membership = new ClubMembershipDTO
                {
                    IsMember = true,
                    IsAdmin = uc.Club.AdminId == userId
                }
            })
            .ToListAsync();

        return clubs;
    }


    public async Task<Club> CreateAsync(ClubCreateRequest request, Guid adminId)
    {
        var club = new Club
        {
            Name = request.Name,
            Description = request.Description,
            AdminId = adminId
        };

        _db.Clubs.Add(club);
        await _db.SaveChangesAsync();
        return club;
    }

    public async Task<bool> UpdateAsync(long id, ClubUpdateRequest request, Guid userId)
    {
        var club = await _db.Clubs.FirstOrDefaultAsync(c => c.Id == id);
        if (club == null || club.AdminId != userId) return false;

        if (!string.IsNullOrEmpty(request.Name))
            club.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Description))
            club.Description = request.Description;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var club = await _db.Clubs.FirstOrDefaultAsync(c => c.Id == id);
        if (club == null) return false;

        _db.Clubs.Remove(club);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> JoinClubAsync(long clubId, Guid userId)
    {
        var exists = await _db.UserClubs
            .AnyAsync(uc => uc.ClubId == clubId && uc.UserId == userId);

        if (exists) return false;

        _db.UserClubs.Add(new UserClub
        {
            ClubId = clubId,
            UserId = userId
        });

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> LeaveClubAsync(long clubId, Guid userId)
    {
        var uc = await _db.UserClubs.FirstOrDefaultAsync(x => x.ClubId == clubId && x.UserId == userId);
        if (uc == null) return false;

        _db.UserClubs.Remove(uc);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ClubSearchDTO>> GetAdminClubsAsync(Guid adminId)
    {
        var clubs = await _db.Clubs
            .Where(c => c.AdminId == adminId)
            .Include(c => c.Members)
            .Include(c => c.Media).ThenInclude(cm => cm.Media)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return clubs.Select(c => new ClubSearchDTO
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ImageUrl = c.Media.Select(m => m.Media.Url).FirstOrDefault(),
            MembersCount = c.Members.Count,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

}
