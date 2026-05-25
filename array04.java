import java.util.Scanner;
class array
{
    public static void main(String args[])
    {
        int a[]=new int [5];
        System.out.println("Enter the Array of the Element");
        Scanner sc = new Scanner(System.in);
        for(int i=0; i<5; i++)
        {
            a[i]=sc.nextInt();
        }
        System.out.println("Array Elements:");
        for(int b:a)
        {
            System.out.println(b+ " ");
        }
    }

}