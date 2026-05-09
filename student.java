//class02 1. 
import java.util.Scanner;
class stu
{
    int rollno;
    int  name;
    void input()
    {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the name of the Student:");
        name = sc.nextInt();
        System.out.println("Enter the rollno of the student:");
        rollno = sc.nextInt();
    }
    void show()
    {
        System.out.println("The name the student is:"+name);
        System.out.println("The rollno of the student is:"+rollno);
    }
}
public class student
{
    public static void main(String[] args) {
        stu s1 = new stu();
        s1.input();
        s1.show();
    }

}