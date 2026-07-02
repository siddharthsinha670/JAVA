// Circle ka circumference calculate karo

import java.util.Scanner;

public class revision04 {
    public static void main(String args[]) {
        try {
            Scanner sc = new Scanner(System.in);
            int r;
            double area;
            System.out.println("Enter the raduis of the circle.");
            r = sc.nextInt();
            area = 3.14 * r * r;
            System.out.println("The area of the raduis is" + area);
        } catch (Exception e) {
            System.out.println("You have entered the invalid input . please enter an integer value...........");
        }

    }
}