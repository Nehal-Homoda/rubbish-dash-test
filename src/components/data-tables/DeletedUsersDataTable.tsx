interface User {
  id: number;
  name: string;
  mobile: string;
  DeleteDate: string;
}
export default function DeletedUsersDataTable() {
  const users: User[] = [
    {
      id: 1,
      name: "حبيبة احمد",
      mobile: "01201988345",
      DeleteDate: "21 مايو 2025",
    },
    {
      id: 2,
      name: "يمنى يوسف",
      mobile: "01201988345",
      DeleteDate: "21 مايو 2025",
    },
    {
      id: 3,
      name: "محمد احمد",
      mobile: "01201988345",

      DeleteDate: "غير محدد",
    },
    {
      id: 4,
      name: "مريم ابراهيم",
      mobile: "01201988345",

      DeleteDate: "21 مايو 2025",
    },
    {
      id: 5,
      name: "هاجر ربيع",
      mobile: "01201988345",
      DeleteDate: "غير محدد",
    },
  ];

  return (
    <>
      <div>DeletedUsersDataTable</div>
    </>
  );
}
