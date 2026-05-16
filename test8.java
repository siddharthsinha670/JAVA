//constructor
import java.util.Scanner;
class student2
{
    private String name;
    private int rollno;
    public void input()
    {
        Scanner sc = new Scanner (System.in);
        System.out.println("Enter the name of the student:");
        name = sc.next();
        System.out.print("Enter the rollno of the Student");
        rollno = sc.nextInt();
    }
    public void show()
    {
        System.out.println("The name of the student is:"+name);
        System.out.println("The rollno of the student is:"+rollno);
    }
}
public class test8
{
    public static void main(String[] args) {
        student2 s1 = new student2();
        s1.input();
        s1.show();
    }
}