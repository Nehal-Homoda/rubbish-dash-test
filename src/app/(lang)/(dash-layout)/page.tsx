
"use client";
// import ChartDemo from "@/components/ui/UIChart";
import React, { useEffect, useState } from "react";
import { chartStatisticsHomeService, collectorsHomeService, paymentsHomeService, statisticsHomeService } from "@/services/sharedService";
import { ChartData, HomeCollector, HomePayment, Statistics } from "@/types/home.interface";
import paymentImg from "@/assets/images/payment-img.png"
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";
import GoogleMap from "@/components/GoogleMap";

// ✅ Dynamically import chart component only on client side
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });


type SeriesItem = {
  name: string;
  data: number[];
};
type BubblePoint = {
  x: string;
  y: number;
  z: number;
};

type BubbleSeriesItem = {
  name: string;
  data: BubblePoint[];
};


export default function Home() {

  const [seriesBar, setSeriesBar] = useState<SeriesItem[]>([{
    name: 'الشهر',
    data: []
  }, {
    name: 'عدد الاشتراكات',
    data: []
  },])

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


  const [seriesBarPackage, setSeriesBarPackage] = useState<BubbleSeriesItem[]>([{
    name: 'عدد الاشتراكات',
    data: []
  },])
  const [optionsBarPackage, setOptionsBarPackage] = useState<ApexOptions>({
    chart: {
      type: 'bubble',
      height: 350
    },
    plotOptions: {
      bubble: {
        zScaling: true,
        minBubbleRadius: 20,
        maxBubbleRadius: 20,
      }
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
      type: 'numeric',

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


  const [statistics, setStatistics] = useState([
    { title: 'عدد الزيارات ', subtitle: 'المكتملة', slug: 'completed_visited' },
    { title: 'عدد  المستخدمين ', subtitle: 'الغير مشتركين', slug: 'no_of_none_subscriptions' },
    { title: 'عدد المستخدمين ', subtitle: 'المشتركين', slug: 'no_of_subscriptions' },
    { title: ' عدد الزيارات ', subtitle: 'الغير مكتملة', slug: 'not_collected_visited' },

  ]);

  const [userStatistics, setUserStatistics] = useState<Statistics | null>(null)
  const [collectors, setCollectors] = useState<HomeCollector | null>(null)
  const [payment, setPayment] = useState<HomePayment | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [categoryName, setCatergoryName] = useState<string[]>([])


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
        text: 'معلق'
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
      console.log(response.data)
      setPayment(response.data)
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
      const packageName = response.data.statsPackage.map((item, index) => {
        return item.package
      })

      // const package_no_subscription = response.data.statsPackage.map((item, index) => {
      //   return item.no_of_subscriptions
      // })

      const bubbleSeries = response.data.statsPackage.map((item) => ({
        x: item.package,
        y: item.no_of_subscriptions,
        z: 2,
      }));
      console.log('x is', name)

      setOptionsBar(prev => ({
        ...prev, ['xaxis']: {
          ...prev.xaxis,
          ['categories']: name
        }
      }));
      setSeriesBar([{
        name: 'الشهر',
        data: month
      }, {
        name: 'عدد الاشتراكات',
        data: no_subscription
      }])


      setOptionsBarPackage(prev => ({
        ...prev, ['xaxis']: {
          ...prev.xaxis,
          ['categories']: packageName
        }
      }));
      setSeriesBarPackage([{
        name: 'عدد الاشتراكات',
        data: bubbleSeries
      }])





    })
  }



  useEffect(() => {
    fetchStatistics()
    fetchCollectors()
    fetchPayments()
    fetchChartStatistics()
  }, [])




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
                    {userStatistics && <span> {userStatistics[item.slug]}</span>}
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
                      <div className="font-bold text-[#38433B] text-lg mb-1">
                        {item.user_name}
                      </div>
                      <div className=" text-[#009414] mb-1 text-base">
                        {item.created_at}
                      </div>
                    </div>
                    <p className="text-[#ADAAAA] mb-1">{item.address}</p>
                    <div className="bg-[#00000009]  rounded-lg py-2 mb-1 px-3">

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
                {/* <div id="chart"></div> */}
                <ReactApexChart options={optionsBarPackage} series={seriesBarPackage} type="bubble" height={350} />
              </div>
            </div>

          </div>

        </div>


        <div className="mb-10">
          <div className="bg-[#00000009] p-3 rounded-3xl">

            <div className="lg:grid grid-cols-2  rounded-2xl  bg-background p-5 w-full ">



              <div>

                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-bold mb-5 text-lg">المدفوعات</h4>
                  </div>
                  <div>
                    <button className="border-none outline-none ">
                      <a className="text-[#009414]" href="/payments">عرض المزيد</a>
                      <span className="mdi mdi-chevron-left text-[#009414] ms-5 text-xl"></span>
                    </button>
                  </div>

                </div>

                {payment && payment.payments.map((item, index) => (
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




              <div className="lg:flex hidden justify-center items-center">
                <div className="w-full aspect-[3/1.8]">
                  <img className="w-full h-full object-contain" src={paymentImg.src} alt="" />
                </div>
              </div>

            </div>

          </div>


        </div>







      </div>




      {/* </div> */}
    </>
  );
}
