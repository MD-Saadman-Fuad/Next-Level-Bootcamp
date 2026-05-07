// union

type userRole = "admin" | "editor" | "viewer";

const getDashboard = (role: userRole) => {
  if (role === "admin") {
    return "Admin Dashboard";
    } else if (role === "editor") {
    return "Editor Dashboard";
    } else {
    return "Viewer Dashboard";
  } 
};

console.log(getDashboard("admin"));

// intersection

type Employee = {
    name: string;
    id: string;
    phoneNo: string;
};

type Manager = {
    designation: string;
    teamSize: number;
};

type ManagementEmployee = Employee & Manager;

const ChowodhuryShaheb : ManagementEmployee = {
    name: "Chowodhury Shaheb",
    id: "EMP001",
    phoneNo: "123-456-7890",
    designation: "Project Manager",
    teamSize: 10,
};