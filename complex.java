import java.util.Scanner;
public class complex {
    int real;
    int imag;
    void input()
    {
        Scanner x = new Scanner(System.in);
        System.out.println("Input the real part");
        real= x.nextInt();
        System.out.println("input the imaginary part:");
        imag = x.nextInt();
    }
    void show()
    {
        System.out.println("The complex no="+ real +"+"+ imag+"i");
    }
}
