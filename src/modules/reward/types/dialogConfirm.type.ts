export interface InforReward{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
}
export interface DialogConfirmProps{
  open: boolean;
  onClose: () => void;
  reward?: InforReward;
  handleSubmit?: (quantity: number) => void;
};