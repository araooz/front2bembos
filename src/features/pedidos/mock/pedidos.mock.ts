import type { Pedido } from "../types/pedido.types";

export const pedidosMock: Pedido[] = [
    {
      tenant_id: "TENANT-001",
      order_id: "ORD-1001-A1B2",
      customer_id: "CUS-5001",
      items: [
        { product_id: "PRD-001-ABCD", quantity: 2, price: 12.5 },
        { product_id: "PRD-002-QWER", quantity: 1, price: 18.0 }
      ],
      total: 43.00,
      status: "CREADO",
      delivery_address: {
        street: "Av. Universitaria 1234",
        district: "San Miguel",
        city: "Lima",
        reference: "Frente a Plaza Vea",
        lat: -12.064,
        lng: -77.079
      },
      estimated_time: "25 min",
      staff_id: null,
      isActive: true,
      createdAt: "2024-12-01T14:22:10Z",
      updatedAt: "2024-12-01T14:22:10Z"
    },
  
    {
      tenant_id: "TENANT-001",
      order_id: "ORD-1002-Z9X8",
      customer_id: "CUS-5002",
      items: [
        { product_id: "PRD-010-XYZA", quantity: 1, price: 25.0 },
        { product_id: "PRD-005-HJKL", quantity: 3, price: 9.5 }
      ],
      total: 53.50,
      status: "EN_PREPARACION",
      delivery_address: {
        street: "Calle Los Cedros 450",
        district: "Miraflores",
        city: "Lima",
        reference: "Altura cuadra 7",
        lat: -12.125,
        lng: -77.03
      },
      estimated_time: "18 min",
      staff_id: "STAFF-001",
      isActive: true,
      createdAt: "2024-12-01T14:45:00Z",
      updatedAt: "2024-12-01T14:51:30Z"
    },
  
    {
      tenant_id: "TENANT-001",
      order_id: "ORD-1003-PLM9",
      customer_id: "CUS-5003",
      items: [
        { product_id: "PRD-020-PLMO", quantity: 2, price: 14.0 }
      ],
      total: 28.00,
      status: "EN_CAMINO",
      delivery_address: {
        street: "Jr. Puno 980",
        district: "Centro Histórico",
        city: "Lima",
        reference: null,
        lat: -12.055,
        lng: -77.03
      },
      estimated_time: "8 min",
      staff_id: "STAFF-010",
      isActive: true,
      createdAt: "2024-12-01T13:50:00Z",
      updatedAt: "2024-12-01T14:55:00Z"
    }
  ];
  