class details
{
    public details() 
    {
        //constructor
    }
    public void detail(String first_name)
    {
        System.out.println("The details of the student is :"+first_name);
    }
    public void detail(String first_name,String last_name)
    {
        System.out.println("The details of the student is :"+first_name + last_name);
    }
    public void detail(String first_name,String last_name,int no)
    {
        System.out.println("The details of the student is:"+first_name + last_name+ no);
    }
    public void detail(String first_name,String last_name,int no,String address)
    {
        System.out.println("The details of the student is:"+first_name + last_name+ no+address);
    }
}
public class test14 
{
    public static void main(String[] args) {
        details dt = new details();
        dt.detail("siddharth");
        dt.detail("Siddharth","Sinha");
    }

}
