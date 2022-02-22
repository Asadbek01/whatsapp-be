export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    checkCredentials: Promise<User | null>;
}

export interface Chat {
    _id: string;
    members: User[];
    messages: Message[];
    avatar: string;
}

export interface Message {
    _id: string;
    timestamp: number;
    sender: string[];
    content: Text & Media;
}

export interface Text {
   text: string
}

export interface Media {
   text: string
}

