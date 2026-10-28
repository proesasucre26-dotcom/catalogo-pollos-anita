export interface ProductOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  choices: {
    name: string;
    extraPrice?: number;
  }[];
  defaultChoice?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  popular?: boolean;
  options?: ProductOption[];
  portionInfo?: string;
}

export interface Category {
  id: string;
  name: string;
  column: 'left' | 'right';
  icon: string;
  shortDesc: string;
  image: string;
  itemCount: number;
}

export interface CartItemOptionSelection {
  optionName: string;
  choice: string;
  extraPrice: number;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: CartItemOptionSelection[];
  notes?: string;
  totalPrice: number;
}

export interface DeliveryFormData {
  fullName: string;
  phone: string;
  address: string;
  reference: string;
  zone: string;
  paymentMethod: 'efectivo' | 'qr';
  cashAmount?: string;
  specialInstructions?: string;
}
