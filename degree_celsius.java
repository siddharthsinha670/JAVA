//Celsius to Fahrenheit Converter

import java.util.Scanner;
class degree_celsius
{
    public static void main(String args[])
    {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the temperature in degree celsius");

        int celsius;
        celsius = sc.nextInt();
        double Fahrenheit = (1.8*celsius)+32;
        System.out.println("The temperature in the fahrenheit= "+Fahrenheit);
    }
}