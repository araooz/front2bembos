export interface DeliveryAddress {
    street?: string | null;
    city?: string | null;
    district?: string | null;
    reference?: string | null;
    lat?: number | null;
    lng?: number | null;
  }
  
  export interface OrderItem {
    product_id: string;
    quantity: number;
    price?: number;
    [key: string]: any;
  }
  
  export type OrderStatus = 
    | "CREADO" 
    | "EN_PREPARACION" 
    | "EN_CAMINO" 
    | "ENTREGADO" 
    | "CANCELADO";
  
  export interface Pedido {
    tenant_id: string;
    order_id: string;
    customer_id: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    delivery_address?: DeliveryAddress | null;
    estimated_time?: string | number | null;
    staff_id?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export const ORDER_STATUS_FLOW: OrderStatus[] = [
    "CREADO",
    "EN_PREPARACION",
    "EN_CAMINO",
    "ENTREGADO"
  ];
  
  export const ACTIVE_STATUSES: OrderStatus[] = [
    "CREADO",
    "EN_PREPARACION",
    "EN_CAMINO"
  ];
  