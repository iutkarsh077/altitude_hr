export interface IUser {
    id: string,
    name: string,
    email: string,
    image: string
}

export interface IUser2 {
    user: IUser
}

export interface IUserInfo {
    UserInfo: IUser2
}


export type CandidateMatch = {
    documentId: string;
    candidateName: string;
    headline: string;
    matchScore: number;
    summary: string;
    skills: string[];
    relevantExperience: string[];
    fileName: string;
    downloadUrl: string;
};

export type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
    candidates?: CandidateMatch[];
};


export interface IChatSessionDetail {
    _id: string,
    name: string,
    updatedAt: string,
    createdAt: string
}