import java.util.Scanner;
public class age
{
    public static void main(String [] args)
    {
        System.out.println("enter the age:");
        Scanner x = new Scanner(System.in);
        int age;
        age = x.nextInt();
        if(age>=18)
        {
            System.out.println("He/She has a right to vote.");
        }
        else{
            
        }
    }
}