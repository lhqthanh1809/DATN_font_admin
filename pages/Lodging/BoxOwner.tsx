import { cn, formatPhone } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { IUser } from "@/interfaces/UserInterface";
import UserService from "@/services/User/UserService";
import { useUserLoadMoreStore } from "@/store/user/useUserLoadMoreStore";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { CrossMedium, User } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import LoadingAnimation from "@/ui/LoadingAnimation";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const BoxOwner: React.FC<{
  owner: IUser | null;
  setOwner: (user: IUser) => void;
}> = ({ owner, setOwner }) => {
  return (
    <Box title="Thông tin chủ sở hữu" className="z-10">
      <View>
        <ListModelUser
          placeHolder="Chọn chủ sở hữu"
          value={owner}
          onChange={(options) => {
            setOwner(options);
          }}
        />
      </View>
    </Box>
  );
};

interface ListModalProps {
  onChange: (options: IUser) => void;
  value: IUser | null;
  placeHolder?: string;
  disabled?: boolean;
  loading?: boolean;
}

function ListModelUser({
  value,
  placeHolder = "",
  disabled = false,
  loading = false,
  onChange,
}: ListModalProps) {
  const { showModal } = useUI();
  const { resetUsers } = useUserLoadMoreStore();

  useEffect(() => {
    resetUsers();
  }, []);

  const handleShowModal = useCallback(() => {
    showModal(
      <ListModalItem
        {...{
          onChange,
          value,
          disabled,
          loading,
          placeHolder,
        }}
      />
    );
  }, [value]);

  return (
    <View className="flex gap-2">
      <View className="flex-row items-center">
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
          Chủ sở hữu
        </Text>
        <Text className="font-BeVietnamRegular text-14 text-red-600 ml-2">
          *
        </Text>
      </View>

      <View>
        <TouchableWithoutFeedback
          disabled={Boolean(disabled || loading)}
          onPress={handleShowModal}
        >
          <View
            className={cn(
              "border-1 border-mineShaft-200 px-3 rounded-xl flex-row items-center gap-2 relative w-full",
              (disabled || loading) && "bg-mineShaft-50",
              value ? "py-2" : "h-[3rem]"
            )}
          >
            {value && (
              <View className="bg-white-200 p-2 rounded-full">
                <Icon icon={User} className="text-white-500" />
              </View>
            )}
            <View className="gap-1">
              <Text
                className={cn(
                  `py-0 text-14 font-BeVietnamMedium text-mineShaft-900 `,
                  !value && "text-mineShaft-300 font-BeVietnamRegular"
                )}
              >
                {value ? value.full_name : placeHolder}
              </Text>

              {value && (
                <Text
                  numberOfLines={1}
                  className="truncate text-12 font-BeVietnamRegular text-white-700"
                >
                  {formatPhone(value.phone)}
                </Text>
              )}
            </View>
            {loading && <LoadingAnimation />}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const ListModalItem: React.FC<{
  onChange: (options: IUser) => void;
  value: IUser | null;
}> = ({ onChange, value }) => {
  const { hideModal } = useUI();
  const {
    listUser,
    options,
    limit,
    offset,
    total,
    loading,
    loadingMore,
    loadMore,
  } = useUserLoadMoreStore();

  const [searchValue, setSearchValue] = useState("");
  const [optionLocal, setOptionLocal] = useState(value);

  useEffect(() => {
    const source = axios.CancelToken.source();
    listUser({
      search: searchValue,
      cancelToken: source.token,
    });
    return () => {
      source.cancel("Hủy request do mất focus hoặc dữ liệu thay đổi");
    };
  }, [searchValue]);

  useEffect(() => {
    if (optionLocal) onChange(optionLocal);
  }, [optionLocal]);

  const handleInputChange = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  return (
    <View
      className={cn(
        "absolute w-full left-0  items-center justify-center top-1/2 -translate-y-1/2 px-4 "
      )}
    >
      <Pressable
        onPress={() => {}}
        className={cn(
          "rounded-xl shadow-sm shadow-white-100 w-full bg-white-50"
        )}
      >
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-mineShaft-950 font-BeVietnamSemiBold text-16">
            Chủ sở hữu
          </Text>
          <Button className="bg-mineShaft-400 p-2" onPress={hideModal}>
            <Icon icon={CrossMedium} className="text-white-50" />
          </Button>
        </View>
        <Divide direction="horizontal" className="h-[1]" />

        <View className="px-4">
          <View className="pt-4">
            <Input
              placeHolder="Tìm kiếm..."
              value={searchValue}
              className="h-11"
              onChange={handleInputChange}
            />
          </View>
          <ScrollView
            nestedScrollEnabled={true}
            className="max-h-96"
            scrollEventThrottle={400}
            onScroll={(event) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                event.nativeEvent;

              const isCloseToBottom =
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 40;

              if (isCloseToBottom && !loadingMore) {
                loadMore();
              }
            }}
          >
            <View className={cn("py-4")}>
              {loading ? (
                <View className="p-1">
                  <LoadingAnimation />
                </View>
              ) : options.length > 0 ? (
                <>
                  {options.map((option, index) => (
                    <Pressable
                      key={index}
                      className={cn(
                        "p-4 flex-row items-center gap-2 rounded-lg",
                        option.id == optionLocal?.id && "bg-lime-200/70"
                      )}
                      onPress={() => {
                        setOptionLocal(option);
                      }}
                    >
                      <View className="bg-lime-400 p-2 rounded-full">
                        <Icon icon={User} className="text-white-50" />
                      </View>
                      <View className="gap-1 flex-1">
                        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
                          {option.full_name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="truncate text-12 font-BeVietnamRegular text-white-700"
                        >
                          {formatPhone(option.phone)}
                        </Text>
                      </View>
                    </Pressable>
                  ))}

                  {loadingMore && (
                    <View className="p-1">
                      <LoadingAnimation />
                    </View>
                  )}
                </>
              ) : (
                <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 text-center p-1">
                  Không có kết quả
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </View>
  );
};

export { BoxOwner };
