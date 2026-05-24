import axios from './http';
import { CharacterCardDTO } from './types/ml';

export const detectCharacters = async (imageFile: File): Promise<CharacterCardDTO[]> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post<CharacterCardDTO[]>('/ml/detection/characters', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};