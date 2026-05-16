class employee
{
    String name;
    int salary;
    public employee(String n,int s)
    {
        name = n;
        salary = s;
    }
    public void showDetails()
    {
        System.out.println("name:"+name);
        System.out.println("salary"+salary);
    }
}
class Developer extends employee
{
    
}