import { Text, View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import { ChevronLeft, ChevronRight } from "../icon/symbol";
import { cn } from "@/helper/helper";
import Input from "../Input";
import { useEffect, useMemo, useState } from "react";
import { parseInt } from "lodash";

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  changePage: (number: number) => void;
}> = ({ currentPage, changePage, totalPages }) => {
  const [page, setPage] = useState(currentPage.toString());
  const maxButtons = 4;
  const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  useEffect(() => {
    setPage(currentPage.toString());
  }, [currentPage]);

  const pageButtons = useMemo(() => {
    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onPress={() => changePage(i)}
          className={cn(
            `rounded-lg w-11 h-11`,
            currentPage === i
              ? "bg-lime-400"
              : "bg-white-50 border-1 border-mineShaft-200"
          )}
        >
          <Text className="text-center text-mineShaft-950 font-BeVietnamMedium">
            {i}
          </Text>
        </Button>
      );
    }
    return buttons;
  }, [startPage, endPage, currentPage, changePage]);

  return (
    <View className="items-center gap-2">
      <View className="flex-row justify-center gap-2">
        <Button
          onPress={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            `rounded-lg w-11 h-11`,
            currentPage === 1
              ? "bg-white-200"
              : "bg-white-50 border-1 border-mineShaft-200"
          )}
        >
          <Icon
            icon={ChevronLeft}
            strokeWidth={2}
            className={cn(currentPage == 1 && "text-mineShaft-950")}
          />
        </Button>
        {pageButtons}
        <Button
          onPress={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            `rounded-lg w-11 h-11`,
            currentPage === totalPages
              ? "bg-white-200"
              : "bg-white-50 border-1 border-mineShaft-200"
          )}
        >
          <Icon
            icon={ChevronRight}
            strokeWidth={2}
            className={cn(currentPage == totalPages && "text-mineShaft-950")}
          />
        </Button>
      </View>
{/* 
      <View className="flex-row">
        <Text className="font-BeVietnamMedium text-white-500 py-2 text-14">
          {`Trang `}
        </Text>
        <Input
          className="w-9 h-9 px-0"
          classNameInput="text-center"
          type="code"
          onChange={(value) => {
            if (value.trim() === "") {
              setPage(value);
              return;
            }

            if (!/^\d+$/.test(value)) {
              setPage(currentPage.toString());
              return;
            }

            setPage(value);

            if (value != "0" && value !== currentPage.toString()) {
              if (parseInt(value) > totalPages) {
                setPage(totalPages.toString())
                changePage(totalPages);
              } else {
                changePage(parseInt(value));
              }
            }
          }}
          value={page}
        />
        <Text className="font-BeVietnamMedium text-white-500 py-2 text-14">
          {` / ${totalPages}`}
        </Text>
      </View> */}
    </View>
  );
};

export default Pagination;
