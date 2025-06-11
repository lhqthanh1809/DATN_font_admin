import { Image, ScrollView, Text, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Href, router, usePathname } from "expo-router";
import { useSidebarStore } from "@/store/sidebar/useSideBarStore";
import HeaderOpenSidebar from "@/ui/layout/HeaderOpenSidebar";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronRight, TrendDown, TrendUp, User } from "@/ui/icon/symbol";
import { Skeleton } from "moti/skeleton";
import useToastStore from "@/store/toast/useToastStore";
import { IUser } from "@/interfaces/UserInterface";
import {
  calcularPers,
  cn,
  convertToNumber,
  getTimezone,
} from "@/helper/helper";
import moment from "moment";
import DashboardService from "@/services/Dashboard/DashboardService";
import { isArray } from "lodash";
import React from "react";

function Dashboard() {
  const { addToast } = useToastStore();
  const { sideBars, setSidebar } = useSidebarStore();
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [errorAvatars, setErrorAvatars] = useState<string[]>([]);
  const [total, setTotal] = useState({
    initial_users: 0,
    current_users: 0,
    initial_lodgings: 0,
    current_lodgings: 0,
  });
  const service = new DashboardService();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [totalResult, latestUsersResult] = await Promise.all([
        service.overview("total"),
        service.overview("latest_users", 5),
      ]);

      if (isArray(latestUsersResult)) {
        setUsers(latestUsersResult);
      }
      if (!("message" in totalResult)) {
        setTotal(totalResult);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const setErrorAvatar = useCallback(
    (id: string) => {
      setErrorAvatars((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          return [...prev, id];
        }
      });
    },
    [errorAvatars]
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSidebar(path as Href);
  }, [path]);

  return (

    <View className="flex-1 bg-white-50">
      <HeaderOpenSidebar title="Tổng quan" />
      <ScrollView className="flex-1 px-5">
        <View className="gap-5">
          <View className=" flex-row flex-wrap gap-4">
            {loading ? (
              [...Array(2)].map((_, index) => (
                <Button
                  className="bg-white-100 rounded-xl p-4 flex-col items-start flex-1 basis-1/3 gap-3"
                  key={index}
                >
                  <Skeleton colorMode="light" height={22} width={"60%"} />
                  <Skeleton colorMode="light" height={26} width={"80%"} />
                  <Skeleton colorMode="light" height={20} width={"40%"} />
                </Button>
              ))
            ) : (
              <>
                {(() => {
                  const percentLodging = calcularPers(
                    total.current_lodgings - total.initial_lodgings,
                    total.initial_lodgings
                  );
                  const percentUser = calcularPers(
                    total.current_users - total.initial_users,
                    total.initial_users
                  );
                  return (
                    <>
                      <Button className="bg-white-50 border-1 border-white-100 shadow-soft-xs rounded-xl p-4 flex-col items-start flex-1 basis-1/3 gap-3">
                        <Text className="font-BeVietnamMedium text-mineShaft-900">
                          Tổng số người dùng
                        </Text>
                        <Text className="font-BeVietnamBold text-mineShaft-950 text-2xl">
                          {convertToNumber(total.current_users.toString())}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Icon
                            icon={percentUser >= 0 ? TrendUp : TrendDown}
                            className={cn(
                              percentUser == 0
                                ? "text-white-500"
                                : percentUser > 0
                                ? "text-lime-500"
                                : "text-redPower-600"
                            )}
                          />
                          <Text
                            className={cn(
                              "font-BeVietnamMedium",
                              percentUser == 0
                                ? "text-white-500"
                                : percentUser > 0
                                ? "text-lime-500"
                                : "text-redPower-600"
                            )}
                          >
                            {percentUser >= 0 && "+"}
                            {convertToNumber(percentUser.toFixed(2))}%
                          </Text>
                        </View>
                      </Button>
                      <Button className="bg-white-50 border-1 border-white-100 shadow-soft-xs rounded-xl p-4 flex-col items-start flex-1 basis-1/3 gap-3">
                        <Text className="font-BeVietnamMedium text-mineShaft-900">
                          Tổng số nơi lưu trú
                        </Text>
                        <Text className="font-BeVietnamBold text-mineShaft-950 text-2xl">
                          {convertToNumber(total.current_lodgings.toString())}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Icon
                            icon={percentLodging >= 0 ? TrendUp : TrendDown}
                            className={cn(
                              percentLodging == 0
                                ? "text-white-500"
                                : percentLodging > 0
                                ? "text-lime-500"
                                : "text-redPower-600"
                            )}
                          />
                          <Text
                            className={cn(
                              "font-BeVietnamMedium",
                              percentLodging == 0
                                ? "text-white-500"
                                : percentLodging > 0
                                ? "text-lime-500"
                                : "text-redPower-600"
                            )}
                          >
                            {percentLodging >= 0 && "+"}
                            {convertToNumber(percentLodging.toFixed(2))}%
                          </Text>
                        </View>
                      </Button>
                    </>
                  );
                })()}
              </>
            )}
          </View>

          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
                Người dùng gần đây
              </Text>

              <Button onPress={() => router.push("/user")}>
                <Text className="font-BeVietnamMedium text-lime-500">
                  Xem tất cả
                </Text>
              </Button>
            </View>

            <View className="gap-3">
              {loading
                ? [...Array(2)].map((_, index) => (
                    <Button
                      className="bg-white-100 rounded-xl p-3 items-center justify-between flex-1 basis-1/3 gap-3"
                      key={index}
                    >
                      <View className="flex-row items-center gap-3">
                        <Skeleton
                          colorMode="light"
                          height={40}
                          width={40}
                          radius={"round"}
                        />
                        <View className="gap-1">
                          <Skeleton
                            colorMode="light"
                            height={20}
                            width={"80%"}
                          />
                          <Skeleton
                            colorMode="light"
                            height={18}
                            width={"50%"}
                          />
                        </View>
                      </View>
                    </Button>
                  ))
                : users.map((user) => {
                    return (
                      <Button
                        className="bg-white-50 border-1 border-white-100 shadow-soft-xs rounded-xl p-3 items-center justify-between flex-1 basis-1/3 gap-3"
                        key={user.id}
                        onPress={() => router.push(`/user/detail/${user.id}`)}
                      >
                        <View className="flex-row items-center gap-3">
                          {errorAvatars.includes(user.id) ? (
                            <View className="bg-white-200 p-2 rounded-full">
                              <Icon icon={User} className="text-white-500" />
                            </View>
                          ) : (
                            <Image
                              source={{
                                uri: `https://ui-avatars.com/api/?name=${user?.full_name}&background=random&color=random`,
                              }}
                              onError={() => setErrorAvatar(user.id)}
                              width={40}
                              height={40}
                              className="rounded-full object-contain"
                            />
                          )}
                          <View className="gap-1">
                            <Text
                              numberOfLines={1}
                              className="font-BeVietnamMedium text-mineShaft-950 truncate"
                            >
                              {user.full_name}
                            </Text>
                            {user.created_at && (
                              <Text
                                numberOfLines={1}
                                className="font-BeVietnamRegular text-mineShaft-800 truncate text-12"
                              >
                                Tham gia ngày{" "}
                                {moment(new Date(user.created_at))
                                  .tz(getTimezone())
                                  .format("DD/MM/YYYY")}
                              </Text>
                            )}
                          </View>
                        </View>

                        <Button>
                          <Icon icon={ChevronRight} />
                        </Button>
                      </Button>
                    );
                  })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Dashboard;
