import { useEffect, useState } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Building,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  Home,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
  CloudAlert,
} from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";
import { employerAnalyticsData } from "@/apiServices/employerApi";
import { toast } from "sonner";
import moment from "moment";
import { Link } from "react-router-dom";

// Sample data
const applicationData = [
  { month: "Jan", applications: 65, jobs: 28, shortlist: 12 },
  { month: "Feb", applications: 59, jobs: 24, shortlist: 10 },
  { month: "Mar", applications: 80, jobs: 35, shortlist: 15 },
  { month: "Apr", applications: 81, jobs: 33, shortlist: 14 },
  { month: "May", applications: 56, jobs: 25, shortlist: 11 },
  { month: "Jun", applications: 55, jobs: 22, shortlist: 9 },
  { month: "Jul", applications: 40, jobs: 18, shortlist: 7 },
  { month: "Aug", applications: 45, jobs: 20, shortlist: 8 },
  { month: "Sep", applications: 62, jobs: 27, shortlist: 12 },
  { month: "Oct", applications: 78, jobs: 34, shortlist: 15 },
  { month: "Nov", applications: 91, jobs: 40, shortlist: 18 },
  { month: "Dec", applications: 74, jobs: 32, shortlist: 14 },
];

const sourceData = [
  { name: "LinkedIn", value: 35 },
  { name: "Company Website", value: 25 },
  { name: "Indeed", value: 20 },
  { name: "Referrals", value: 15 },
  { name: "Other", value: 5 },
];

// const jobPerformanceData = [
//   { name: "Software Engineer", applications: 120, jobs: 45, hires: 8 },
//   { name: "Product Manager", applications: 85, jobs: 30, hires: 5 },
//   { name: "UX Designer", applications: 65, jobs: 25, hires: 4 },
//   { name: "Data Analyst", applications: 55, jobs: 20, hires: 3 },
//   { name: "Marketing", applications: 40, jobs: 15, hires: 2 },
// ]

const recentApplications = [
  {
    id: "APP-1234",
    name: "John Smith",
    position: "Software Engineer",
    date: "2025-03-25",
    status: "Interview",
  },
  {
    id: "APP-1235",
    name: "Sarah Johnson",
    position: "Product Manager",
    date: "2025-03-24",
    status: "Review",
  },
  {
    id: "APP-1236",
    name: "Michael Brown",
    position: "UX Designer",
    date: "2025-03-23",
    status: "Hired",
  },
  {
    id: "APP-1237",
    name: "Emily Davis",
    position: "Data Analyst",
    date: "2025-03-22",
    status: "Rejected",
  },
  {
    id: "APP-1238",
    name: "David Wilson",
    position: "Marketing Specialist",
    date: "2025-03-21",
    status: "Review",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("year");
  const [overallData, setOverallData] = useState();
  const [applicationData, setApplicationData] = useState([]);
  // const [sourceData, setSourceData] = useState([])
  const [recentApplications, setRecentApplications] = useState([]);
  const Employer = useSelector((state) => state.employer.employer);

  const fetchData = async () => {
    try {
      const response = await employerAnalyticsData(Employer?.employerId);
      console.log("response after employer AnalyticsData: ", response);
      if (response?.data) {
        // const updated = response.data.response;
        const data = response.data;

        setOverallData(data.overallData);
        setRecentApplications(data.recentApplications);

        // Format data for frontend chart (sorting by month)
        const chartD = data.chartData;
        const dataMap = new Map(
          chartD.map((item) => {
            const monthKey = `${item.year}-${item.month
              .toString()
              .padStart(2, "0")}`;
            return [monthKey, item];
          })
        );

        // Generate the past 12 months
        const last12Months = Array.from({ length: 12 }, (_, i) => {
          const date = moment().subtract(i, "months");
          const monthKey = date.format("YYYY-MM"); // e.g., "2025-02"
          const monthLabel = date.format("MMM"); // e.g., "Feb"

          return dataMap.has(monthKey)
            ? { ...dataMap.get(monthKey), month: monthLabel } // Use existing data
            : { month: monthLabel, applications: 0, jobs: 0, shortlist: 0 }; // Fill missing months with 0
        }).reverse(); // Keep months in order (oldest to newest)

        setApplicationData(last12Months);
      }
    } catch (error) {
      console.log(
        "Error in AnalyticsData at employer listing component: ",
        error.message
      );
      toast.error("An unexpected error occured");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {/* <div className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Building className="mr-2 h-6 w-6" />
          <h1 className="font-semibold">TalentHub</h1>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
            <Button
              variant="secondary"
              className="relative flex h-9 justify-start gap-2 rounded-lg bg-primary/10 px-3 text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
              <Badge className="ml-auto flex h-6 w-6 items-center justify-center rounded-full">12</Badge>
            </Button>
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <Users className="h-4 w-4" />
              <span>Candidates</span>
            </Button>
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              <Badge className="ml-auto flex h-6 w-6 items-center justify-center rounded-full">5</Badge>
            </Button>
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Button>
            <Button
              variant="ghost"
              className="relative flex h-9 justify-start gap-2 rounded-lg px-3 text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Jane Doe</span>
              <span className="text-xs text-muted-foreground">HR Manager</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        {/* <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Button variant="outline" size="sm" className="ml-auto h-8 gap-1">
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">Account</span>
          </Button>
        </header> */}

        {/* Dashboard Content */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8 ">
          <div className="flex flex-col gap-4 md:gap-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-col-reverse md:flex-row md:items-center md:justify-between">
              <h1 className="sm:text-xl lg:text-2xl font-bold tracking-tight">
                Recruitment Dashboard
              </h1>

              <div className="flex flex-row sm:flex-col gap-2 md:flex-row md:items-center md:gap-2">
                <Link to="/employer/create_job">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Create Job
                  </button>
                </Link>

                <Link to="/employer/job_list">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    View Jobs
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid sm:gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card >
                <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Applications
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {overallData?.totalApplications
                      ? overallData.totalApplications
                      : "0"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Jobs
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {overallData?.totalJobs ? overallData.totalJobs : "0"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Hiring Rate
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {overallData?.totalApplication
                      ? `${overallData.totalApplication}%`
                      : "0%"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle className="sm:text-xl lg:text-2xl">Application Trends</CardTitle>
                  <CardDescription>
                    Monthly application, jobs, and hire rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      applications: {
                        label: "Applications",
                        color: "hsl(var(--chart-1))",
                      },
                      jobs: {
                        label: "jobs",
                        color: "hsl(var(--chart-2))",
                      },
                      hires: {
                        label: "shortlist",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="aspect-[4/3]"
                  >
                    {!applicationData && applicationData.length < 1 ? (
                      <div className="flex flex-col h-full items-center justify-center text-lg font-semibold text-slate-500">
                        <CloudAlert className="h-32 w-32" />
                        <p>Data not found</p>
                      </div>
                    ) : (
                      <LineChart
                        data={applicationData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="applications"
                          stroke="var(--color-applications)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="jobs"
                          stroke="var(--color-jobs)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="shortlist"
                          stroke="var(--color-hires)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    )}
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>
                    Where candidates are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {sourceData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest candidate applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 font-medium">S.No</th>
                        <th className="px-4 py-3 font-medium">Candidate</th>
                        <th className="px-4 py-3 font-medium">Position</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 font-medium">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span>{app.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{app.jobTitle}</td>
                          <td className="px-4 py-3">
                            {moment(app.createdAt).format("MMM D, YYYY h:mm A")}
                          </td>
                          <td className="px-4 py-3">{app.status}</td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span className="sr-only">Actions</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Schedule Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Reject Application
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </main>
      </div>
    </div>
  );
}

// Menu icon component
function Menu(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
