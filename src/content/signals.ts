export type Signal = {
  id: string;
  text: string;
  fuente: string;
};

export const signals: Signal[] = [
  {
    id: "whatsapp-repetitivo",
    text:
      "Muchos comerciantes pierden tiempo respondiendo siempre lo mismo por WhatsApp.",
    fuente: "Cliente",
  },
  {
    id: "stock-planilla",
    text: "Vendieron más pero el stock sigue en una planilla y los pedidos en 14 chats.",
    fuente: "Cliente",
  },
];
