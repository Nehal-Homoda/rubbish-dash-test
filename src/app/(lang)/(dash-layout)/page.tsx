
"use client";
// import ChartDemo from "@/components/ui/UIChart";
import React, { useEffect, useState } from "react";
import { chartStatisticsHomeService, collectorsHomeService, paymentsHomeService, statisticsHomeService } from "@/services/sharedService";
import { ChartData, HomeCollector, Payment, Statistics, UserListWithRecycle } from "@/types/home.interface";
import paymentImg from "@/assets/images/payment-img.png"
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";
import GoogleMap from "@/components/GoogleMap";
import Link from "next/link";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import { Users } from "@/types/auth.interface";
import { getUserService } from "@/services/userService";
import { useRouter } from "next/navigation";

// ✅ Dynamically import chart component only on client side
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });


type SeriesItem = {
  name: string;
  data: number[];
};


type BubbleSeriesItem = {
  name: string;
  data: number[];
};


export default function Home() {


  const headerArr = [
    { text: "ID", name: "id" },
    { text: "اسم المستخدم", name: "name" },
    { text: "الوزن", name: "weight" },
    { text: "الرصيد", name: "name" },
    { text: "الاجراءات", name: "name" },

  ];

  const [dataList, setDataList] = useState<Users[]>([]);


  const [seriesBar, setSeriesBar] = useState<SeriesItem[]>([
    {
      name: 'الشهر',
      data: []
    }, {
      name: 'عدد الاشتراكات',
      data: []
    },])



  const [seriesBarPackage, setSeriesBarPackage] = useState<BubbleSeriesItem[]>([



    {
      name: 'عدد الاشتراكات',
      data: []
    }

  ])



  const [optionsBar, setOptionsBar] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
    },
    // yaxis: {
    //   title: {
    //     text: '$ (thousands)'
    //   }
    // },
    fill: {
      opacity: 1
    },
    // tooltip: {
    //   y: {
    //     formatter: function (val) {
    //       return "$ " + val + " thousands"
    //     }
    //   }
    // }
  })



  const [optionsBarPackage, setOptionsBarPackage] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      },
      // bar: {
      //   horizontal: false,
      //   columnWidth: '55%',
      //   borderRadius: 5,
      //   borderRadiusApplication: 'end'
      // },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {

      categories: [],
    },
    fill: {
      opacity: 1
    },

  })


  const [statistics, setStatistics] = useState([
    { title: 'عدد الزيارات ', subtitle: 'المكتملة', slug: 'completed_visited' },
    { title: ' عدد الزيارات ', subtitle: 'الغير مكتملة', slug: 'not_collected_visited' },
    { title: 'عدد المستخدمين ', subtitle: 'المشتركين', slug: 'no_of_subscriptions' },
    { title: 'عدد  المستخدمين ', subtitle: 'الغير مشتركين', slug: 'no_of_none_subscriptions' },

  ]);


  const fetchDataList = () => {


    getUserService().then((response) => {
      //@ts-ignore
      setDataList(response.data);


    });
  };

  useEffect(() => {
    fetchDataList()
  }, [])

  const [userStatistics, setUserStatistics] = useState<Statistics | null>(null)
  const [collectors, setCollectors] = useState<HomeCollector | null>(null)
  const [payment, setPayment] = useState<Payment[]>([])
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [categoryName, setCatergoryName] = useState<string[]>([])
  const [userListRecycle, setUserListRecycle] = useState<UserListWithRecycle[]>([])
  const router = useRouter()


  const paymentList = [
    "rejected",
    "accepted",
    "pending"
  ]

  const payment_status = (name: string) => {
    if (name === "rejected")
      return {
        style: "bg-red-100 text-red-600 px-5 py-1 rounded-lg",
        text: 'مرفوض'

      }
    if (name === "accepted")
      return {
        style: "bg-[#31D00012] text-[#009414] px-5 py-1 rounded-lg",
        text: 'مقبول'
      }

    if (name === "pending")
      return {
        style: "bg-[#FBBC0512] text-[#FBBC05] px-5 py-1 rounded-lg ",
        text: 'قيد الانتظار'
      }
  };



  const fetchStatistics = () => {

    statisticsHomeService().then((response) => {
      setUserStatistics(response.data)
      console.log('user static', userStatistics)

    })
      .catch(error => {

      })


  }
  const fetchCollectors = () => {
    collectorsHomeService().then((response) => {

      setCollectors(response.data)
      console.log(response.data)
    })
  }
  const fetchPayments = () => {
    paymentsHomeService().then((response) => {
      console.log(response.data.payments)
      setPayment(response.data.payments)
      setUserListRecycle(response.data.users_request_recycle)
    })
  }

  const fetchChartStatistics = () => {
    chartStatisticsHomeService().then((response) => {
      setChartData(response.data)
      const name = response.data.statsCategory.map((item, index) => {
        return item.category
      })
      const month = response.data.statsCategory.map((item, index) => {
        return item.month
      })
      const no_subscription = response.data.statsCategory.map((item, index) => {
        return item.no_of_subscriptions
      })
      const package_no_subscription = response.data.statsPackage.map((item, index) => {
        return item.no_of_subscriptions
      })
      const packageName = response.data.statsPackage.map((item, index) => {
        return item.package
      })



      // const package_no_subscription = response.data.statsPackage.map((item, index) => {
      //   return item.no_of_subscriptions
      // })

      // const bubbleSeries = response.data.statsPackage.map((item) => ({
      //   x: item.package,
      //   y: item.no_of_subscriptions,
      //   z: 2,
      // }));
      console.log('x is', name)

      setOptionsBar(prev => ({
        ...prev, ['xaxis']: {
          ...prev.xaxis,
          ['categories']: name
        }
      }));




      setOptionsBarPackage(prev => ({
        ...prev, ['xaxis']: {
          ...prev.xaxis,
          ['categories']: packageName
        }
      }));



      setSeriesBar([{
        name: 'الشهر',
        data: month
      }, {
        name: 'عدد الاشتراكات',
        data: no_subscription
      }])



      setSeriesBarPackage([

        {
          name: 'عدد الاشتراكات',
          data: package_no_subscription
        }])





    })
  }



  useEffect(() => {
    fetchStatistics()
    fetchCollectors()
    fetchPayments()
    fetchChartStatistics()
  }, [])
  const handleGoToUser = () => {

    router.push('/users/is_request_recycle')
  }



  useEffect(() => {

  }, [categoryName])







  return (
    <>
      <div className="home-page">

        {/* <div className="py-20 container"> */}




        <div className="mb-10">
          <div className="bg-[#00000009] p-3 rounded-3xl">
            <div className="grid xl:grid-cols-4 lg:grid-cols-2  grid-cols-1   gap-5">
              {statistics.map((item, index) => (
                <div key={index} className="flex justify-between rounded-3xl bg-background  p-5 w-full">

                  <div className="text-[#ADAAAA]">

                    <div className="mb-3">
                      {item.title}
                    </div>
                    <div className="font-bold text-[#38433B]">
                      {item.subtitle}
                    </div>
                  </div>


                  <div className=" text-[#38433B] text-2xl font-bold">
                    {userStatistics && <span>{item.slug === 'completed_visited'
                      ? (`${userStatistics.total_visits_count} / ${userStatistics[item.slug]}`)
                      : userStatistics[item.slug]}</span>}
                  </div>


                </div>



              ))}

            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-[#00000009]  p-4 rounded-3xl">
            <div className="grid grid-cols-2 gap-5">

              <div className="lg:col-span-1 col-span-2  rounded-2xl bg-background  p-7 w-full">
                <h4 className="font-bold mb-5 text-lg">الخريطة</h4>
                <div className="aspect-[3/3]">
                  <GoogleMap></GoogleMap>
                </div>
              </div>

              <div className="lg:col-span-1 col-span-2 rounded-2xl bg-background  p-7 w-full ">
                <h4 className="font-bold mb-5 text-lg">الملاحظات</h4>
                <div className="aspect-[3/3] overflow-auto">

                  {collectors && collectors.notes_visit.map((item, index) => (
                    <div key={index} className="py-5">
                      <div className="title flex justify-between">
                        <div className="font-bold text-[#38433B] text-base mb-1">
                          {item.user_name}
                        </div>
                        <div className=" text-[#009414] mb-1 text-sm">
                          {item.created_at}
                        </div>
                      </div>
                      <p className="text-[#ADAAAA] mb-1 text-sm">{item.address}</p>
                      <div className="bg-[#00000009] text-sm  rounded-lg py-2 mb-1 px-3">

                        <span className="text-[#38433B]">ملاحظة :  </span>
                        <span className="text-[#ADAAAA] ms-2">{item.user_note}</span>

                      </div>



                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="mb-10">
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-5" >
            <div className="bg-[#00000009] p-3 rounded-3xl">
              <div className="rounded-2xl bg-background  p-5 w-full ">
                {/* <div id="chart"></div> */}
                <ReactApexChart options={optionsBar} series={seriesBar} type="bar" height={350} />
              </div>
            </div>


            <div className="bg-[#00000009] p-3 rounded-3xl">
              <div className="rounded-2xl bg-background  p-5 w-full ">

                <ReactApexChart options={optionsBarPackage} series={seriesBarPackage} type="bar" height={350} />
              </div>
            </div>

          </div>

        </div>


        <div className="mb-10">


          <div className="grid xl:grid-cols-2 grid-cols-1 gap-5  rounded-2xl  bg-background  w-full ">



            <div className="bg-[#00000009] p-4 rounded-3xl ">
              <div className="rounded-2xl bg-background  p-5 w-full h-[500px] overflow-y-auto ">

                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-bold mb-5 text-lg">المدفوعات</h4>
                  </div>
                  <div>
                    <button className="border-none outline-none ">
                      <Link className="text-[#009414]" href="/payments">عرض المزيد</Link>
                      <span className="mdi mdi-chevron-left text-[#009414] ms-5 text-xl"></span>
                    </button>
                  </div>

                </div>

                {payment && payment.map((item, index) => (
                  <div key={index} className="bg-[#00000009] rounded-3xl px-2 py-1 mb-4">


                    <div key={index} className="flex justify-between py-5">
                      <div className="flex  gap-4">


                        <div>
                          <div className="w-10 h-10 rounded-full ">
                            <img className="w-full h-full object-contain" src={item.payment_method_image} alt="" />
                          </div>
                        </div>



                        <div className="">
                          <p className="mb-1 font-bold text-[#38433B] text-lg">{item.user_name}</p>
                          <p className="text-[#009414] font-bold mb-1">{item.total_price}</p>
                          <p className="text-[#ADAAAA]">{item.created_at}</p>
                        </div>

                      </div>
                      <div>

                        <div className={payment_status(item.status)?.style}>
                          {payment_status(item.status)?.text}

                        </div>
                      </div>
                    </div>

                  </div>
                ))}

              </div>




              {/* <div className="lg:flex hidden justify-center items-center">
                <div className="w-full aspect-[3/1.8]">
                  <img className="w-full h-full object-contain" src={paymentImg.src} alt="" />
                </div>
              </div> */}



            </div>


            <div className="bg-[#00000009] p-4 rounded-3xl ">
              <div className="rounded-2xl bg-background  p-5 w-full h-[500px] overflow-y-auto">
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-bold mb-5 text-lg">المستخدمين “ اعادة التدوير “</h4>
                  </div>
                  <div>
                    <button className="border-none outline-none ">
                      <Link className="text-[#009414]" href="/users?is_request_recycle=1">عرض المزيد</Link>
                      <span className="mdi mdi-chevron-left text-[#009414] ms-5 text-xl"></span>
                    </button>
                  </div>




                </div>


                <div className="w-full overflow-x-auto min-h-[350px]">
                  <table
                    id="default-table"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead className="  text-[#38433B8F] uppercase  dark:bg-gray-700 dark:text-gray-400">
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 ">
                        {headerArr.map((item, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-4 py-5 "
                          >
                            <div className="flex gap-2 text-nowrap font-bold">
                              <div className="flex flex-col cursor-pointer space-y-0 justify-center items-center leading-none ">

                              </div>
                              <span className="cursor-pointer">
                                {item.text}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {userListRecycle.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="py-5 px-4">{item.id}</td>
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">{item.all_recycle_weights}</td>
                          <td className="py-2 px-4">{item.deserved_money_by_recycle}</td>
                          <td className="py-2 px-4">



                            <button onClick={() => { }} className="bg-blue-100 p-1 px-2 rounded-lg">
                              <span className="mdi mdi-eye text-blue-500"></span>
                            </button>
                          </td>

                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>


        </div>







      </div>





    </>
  );
}
