export interface ChatMessage {
  id?: number;
  userId?: number;
  pregunta: string;
  respuesta: string;
  createdAt?: string;
}

export interface ChatKnowledge {
  id?: number;
  pregunta: string;
  respuesta: string;
  categoria?: string;
  palabrasClave?: string[];
  activo?: boolean;
  createdAt?: string;
}

export interface ChatSendMessage {
  pregunta: string;
  userId?: number;
}
