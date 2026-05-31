//Check Even/Odd Without % Operator

import java.util.Scanner;

class even_odd02 {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the even and odd number: ");

        int n = sc.nextInt();
        if ((n / 2) * 2 == n) {
            System.out.println("It is an even number.");
        } else {
            System.out.println("It is an odd number.");
        }
    }
}