//Find ASCII Value of Character

import java.util.Scanner;
class ASCIIvalue
{
    public static void main(String args[])
    {
        Scanner sc = new Scanner(System.in);
        char ch;
        System.out.println("Enter the character:");
        ch = sc.next().charAt(0);

        int ascii = ch;
        System.out.println("ASCCI Value ="+ascii);
    }
}