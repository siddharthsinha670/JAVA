import java.util.Scanner;
public class age
{
    public static void main(String [] args)
    {
        System.out.println("enter the age:");
        try (Scanner sc = new Scanner(System.in)) {
            int age;
            age = sc.nextInt();
            if(age>=18)
            {
                System.out.println("He/She has a right to vote.");
            }
            else
            {
                System.out.println("He/she should not have right to vote.");
            }
        }
    }
}