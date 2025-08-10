import React from "react";
import { Text, View } from "@/components/Themed";
import { formatDate, formatPrice } from "@/lib/utils";
import { Grid, GridItem } from "@/components/ui/grid";
import { Image } from "@/components/ui/image";
import { TicketDB } from "@/types/ticket";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

export default function ContentSection({ tickets }: { tickets: TicketDB[] }) {
  return (
    <Grid
      className="gap-4"
      _extra={{
        className: "grid-cols-2",
      }}
    >
      {tickets.map((ticket) => {
        if (ticket.sold) {
          return null;
        }
        return (
          <GridItem
            key={ticket.id}
            className="bg-white shadow-lg rounded-xl"
            _extra={{
              className: "flex-1",
            }}
          >
            <Image
              source={{
                uri: ticket.thumbnail || "https://via.placeholder.com/150",
              }}
              className="w-full h-32 object-cover rounded-t-xl"
              alt={ticket.name}
            />
            <VStack className="gap-2 p-4">
              <Text className="text-[#464646] font-poppins-bold text-lg mb-1">
                {ticket.name}
              </Text>
              <HStack className="text-white font-bold text-lg justify-between">
                <Text className="text-[#464646] text-sm">
                  {formatDate(ticket.date)}
                </Text>
                <Text className="text-[#464646] text-sm">2 Ticket</Text>
              </HStack>
              <Text className="text-[#464646] font-poppins-semibold text-sm pb-4">
                {formatPrice(ticket.price)}
              </Text>
            </VStack>
          </GridItem>
        );
      })}
    </Grid>
  );
}
