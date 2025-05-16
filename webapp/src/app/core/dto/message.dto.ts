export interface MessageDto {
  type:"danger" | "success" | "info" | "warning";
  message?: string;
  hasMessage: boolean;
}
