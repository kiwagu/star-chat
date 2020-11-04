export type UserDto = {
  id: string;
  username: string;
  email: string;
};

export type MessageDto = {
  id: string;
  user: UserDto;
  toUser: UserDto;
  body: string;
  createdAt: number;
};

export type CreateMessageDto = {
  toUserId: string;
  body: string;
};
