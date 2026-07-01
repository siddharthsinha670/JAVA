
//2.	Do numbers input lo aur sum print karo.
import java.util.Scanner;

public class revision02 {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int a, b, Add;
        try {
            System.out.println("Enter the first number a");
            a = sc.nextInt();
            System.out.println("Enter the second number b :");
            b = sc.nextInt();
            Add = a + b;
            System.out.println("The result of the given number is: " + Add);
        } catch (Exception e) {
            System.out.println("You have entered a wrong input !!!!!");
        }

    }
}