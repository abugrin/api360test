export interface TicketResponse {
    self: string;
    id: string;
    key: string;
    version: number;
    summary: string;
    fname: string;
    statusStartTime: string;
    updatedBy: UpdatedBy;
    statusType?: unknown;
    plate: string;
    type: Type;
    priority: Type;
    createdAt: string;
    createdBy: UpdatedBy;
    commentWithoutExternalMessageCount: number;
    votes: number;
    commentWithExternalMessageCount: number;
    queue: Type;
    updatedAt: string;
    status: Type;
    favorite: boolean;
  }
  
  export interface Type {
    self: string;
    id: string;
    key: string;
    display: string;
  }
  
  export interface UpdatedBy {
    self: string;
    id: string;
    display: string;
    cloudUid: string;
    passportUid: number;
  }