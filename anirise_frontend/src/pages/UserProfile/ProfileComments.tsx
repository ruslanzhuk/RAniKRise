import UserCommentSection from "../../components/comments/UserCommentSection";

interface Props {
  userId: string;
}

export default function ProfileComments({ userId }: Props) {
  return <UserCommentSection profileUserId={userId} />;
}

