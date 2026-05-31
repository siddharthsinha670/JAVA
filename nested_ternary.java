
/*
 * Find Largest Among 3 Numbers Using Ternary Operator
 * Nested ternary use karna hai.
 */
import java.util.Scanner;

class nested_ternary {
    public static void main(String args[]) {
        try (Scanner sc = new Scanner(System.in)) {
            System.out.println("Enter the first number: ");
            int a = sc.nextInt();

            System.out.println("Enter the second number: ");
            int b = sc.nextInt();

            System.out.println("Enter the third number: ");
            int c = sc.nextInt();

            int largest = (a > b)
                    ? ((a > c) ? a : c)
                    : ((b > c) ? b : c);

            System.out.println("largest Nummber =" + largest);
        }
    }
}