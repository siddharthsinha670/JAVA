// 3. Rectangle ka area calculate karo

import java.util.Scanner;

public class revision03 {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int length, breath, area;
        try {
            System.out.println("Enter the length of the rectangle :");
            length = sc.nextInt();
            System.out.println("Enter the breath of the rectangle :");
            breath = sc.nextInt();
            area = length * breath;
            System.out.println("The area of the rectangle :" + area);
        } catch (Exception e) {
            System.out.println("You have entered the invalid details.");
        }
    }
}