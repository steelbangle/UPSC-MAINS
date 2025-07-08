export interface UPSCAnswer {
  chainOfThought: string;
  modelAnswer: string;
  valueAddition: string;
}

export interface FormInputs {
  subject: string;
  question: string;
  wordLimit: number;
}

export interface HistoryItem {
  id: string;
  inputs: FormInputs;
  answer: UPSCAnswer;
  timestamp: string;
}
