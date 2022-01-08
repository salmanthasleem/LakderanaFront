import './App.css';
import Layout from './components/layout/layout'
import store from './redux/store';
import { Provider } from 'react-redux';
import Auth from './screens/login/Auth';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme'
import AuthProvider from './components/auth/authProvider';
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/layout/dashboard';
import CustomerHandling from './sections/staff/customerHandling';
import PaymentAndServices from './sections/staff/payments&Services';
import Bar from './sections/staff/bar';
import AttendanceDashBoard from './sections/hrStaff/attendance';
import Employee from './sections/hrStaff/employee';
import ManageBranches from './sections/manager/manageBranch';
import ManageEmployee from './sections/manager/manageEmployee';
import ManageRooms from './sections/manager/manageRooms';
import Statistics from './sections/manager/statistics';
import CustomerFrontBoard from './screens/dashboards/customer'
import PaymentsFrontBoard from './screens/dashboards/payments'
import BarFrontBoard from './screens/dashboards/barFB'

import CustomerInquiry from './screens/customer/customerInquiry/customerInquiry';
import CustomerRegistration from './screens/customer/customerRegistration/customerRegistration';
import InHotelCustomers from './screens/customer/inHotelCustomers/inHotelCustomrs';

import ReserveRoom from './screens/paymentsAndServices/room/reserveRoom';
import Services from './screens/paymentsAndServices/services/services';

import FrontDesk from './screens/bar/frontDesk/frontDesk';
import Inventory from './screens/bar/inventory/inventory';

import Attendance from './screens/manage/attendance/attendance';

import ConfigureSalary from './screens/manage/employee/configureSalary';
import EmployeeDetails from './screens/statistics/viewEmployee';

import AddRoom from './screens/manage/rooms/addRoom';
import ViewRooms from './screens/manage/rooms/viewRooms';

import AddEmployee from './screens/manage/employee/addEmployee';

import AddBranch from './screens/manage/branches/addBranch';
import ViewBranches from './screens/manage/branches/viewBranches';

import BarStatsDaily from './screens/statistics/bar/dailyStats';
import AttendanceStats from './screens/statistics/attendanceStats';
import IncomeStats from './screens/statistics/income';
import Protector from './components/auth/protector'
import UnderConstruction from './components/underConstruction'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Auth />} />
              <Route
                path="/protected"
                element={
                  <Protector>
                    <Dashboard />
                  </Protector>
                }
              >

                <Route path="CustomerHandling" element={<CustomerHandling />}>
                  <Route path="CustomerInquiry" element={<CustomerInquiry />} />
                  <Route path="CustomerRegistration" element={<CustomerRegistration width={'40%'} />} />
                  <Route path="InHotelCustomers" element={<InHotelCustomers />} />
                  <Route path="*" element={<CustomerFrontBoard />} />
                  <Route path="" element={<CustomerFrontBoard />} />
                  {/* <Route path="*" element={<CustomerRegistration width={'40%'} />} />
                  <Route path="" element={<CustomerRegistration width={'40%'} />} /> */}
                </Route>

                <Route path="PaymentsAndServices" element={<PaymentAndServices />}>
                  <Route path="ReserveRoom" element={<ReserveRoom />} />
                  <Route path="Services" element={<Services />} />
                  <Route path="*" element={<PaymentsFrontBoard />} />
                  <Route path="" element={<PaymentsFrontBoard />} />
                  {/* <Route path="*" element={<ReserveRoom />} />
                  <Route path="" element={<ReserveRoom />} /> */}
                </Route>

                <Route path="Statistics" element={<Statistics />}>
                  <Route path="BarStatsDaily" element={<BarStatsDaily />} />
                  <Route path="AttendanceStats" element={<AttendanceStats />} />
                  <Route path="IncomeStats" element={<IncomeStats />} />
                  <Route path="*" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Other General Statistics Will Be Coming Up Here...." />} />
                  <Route path="" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Other General Statistics Will Be Coming Up Here...." />} />
                </Route>
                <Route path="Bar" element={<Bar />}>
                  <Route path="FrontDesk" element={<FrontDesk />} />
                  <Route path="Inventory" element={<Inventory />} />
                  <Route path="*" element={<BarFrontBoard />} />
                  <Route path="" element={<BarFrontBoard />} />
                  {/* <Route path="*" element={<FrontDesk />} />
                  <Route path="" element={<FrontDesk />} /> */}
                </Route>

                <Route path="Attendance" element={<AttendanceDashBoard />}>
                  <Route path="*" element={<Attendance />} />
                  <Route path="" element={<Attendance />} />
                </Route>

                <Route path="ManageStaff" element={<Employee />}>
                  <Route path="ConfigureSalary" element={<ConfigureSalary />} />
                  <Route path="EmployeeDetails" element={<EmployeeDetails />} />
                  <Route path="*" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Staff Statistics Is Coming Up Here...." />} />
                  <Route path="" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Staff Statistics Is Coming Up Here...." />} />
                </Route>

                <Route path="ManageRooms" element={<ManageRooms />}>
                  <Route path="AddRoom" element={<AddRoom />} />
                  <Route path="ViewRooms" element={<ViewRooms />} />
                  <Route path="*" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Rooms Dashboard Is Coming Up Here...." />} />
                  <Route path="" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Rooms Dashboard Is Coming Up Here...." />} />
                </Route>

                <Route path="ManageEmployees" element={<ManageEmployee />}>
                  <Route path="AddEmployee" element={<AddEmployee />} />
                  <Route path="*" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Employee Dashboard Is Coming Up Here...." />} />
                  <Route path="" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Employee Dashboard Is Coming Up Here...." />} />
                </Route>

                <Route path="ManageBranches" element={<ManageBranches />}>
                  <Route path="AddBranch" element={<AddBranch />} />
                  <Route path="ViewBranches" element={<ViewBranches />} />
                  <Route path="*" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Hotel Branches Dashboard Is Coming Up Here...." />} />
                  <Route path="" element={<UnderConstruction subText="Navigate To Other Sections By Clicking One Of The Item/s On The Top Navigation Bar" text="Hotel Branches Dashboard Is Coming Up Here...." />} />
                </Route>
                <Route path="*" element={<UnderConstruction text="Hmmm.... Not Sure If This Is The Right Place" />} />
                <Route path="" element={<UnderConstruction text="Hmmm.... Not Sure If This Is The Right Place" />} />

              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
