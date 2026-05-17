class employee
{
    public employee()
    {
        System.out.println("Constructor of the employee.");
    }
    public void name()
    {
        System.out.println("Enter the name of the employee");
    }
    public void salary()
    {
        System.out.println("The salary of the employee is:");
    }
}
class empdetails extends employee
{
    public empdetails()
    {
        System.out.println("Constructor of the employee details");
    }
    public void empname()
    {
        System.out.println("The name of the employee is rahul.");
    }
    public void empsalary()
    {
        System.out.println("The salary of the employee is 50k");
    }
}
public class inheritance04
{
    public static void main(String[] args)
    {
        empdetails emp = new empdetails();
        emp.name();
        emp.empname();
        emp.salary();
        emp.empsalary();
    }
    
}