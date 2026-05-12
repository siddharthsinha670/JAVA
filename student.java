import java.util.Scanner;
class stu
{
    private int name;
    private int rollno;
    public void input()
    {
        Scanner sc = new Scanner (System.in);
        System.out.println("Enter the name of the student :");
        name = sc.nextInt();
        System.out.println("Enter the rollno of the student :");
        rollno = sc.nextInt();
    }
    public void show()
    {
        System.out.println("The name of the student is :"+name);
        System.out.println("The rollno of the student is :"+rollno);
    }
    public class student
    {
        public static void main(String args[])
        {
            stu s1 = new stu();
            s1.input();
            s1.show();
            

        }

    }
}