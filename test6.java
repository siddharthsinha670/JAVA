//static member
class A1 {
     static private int x;
    private int y;
    public A1()
    {
        x =1;
        y=y+2;
    }
    public A1(int x1)
    {
        x = x1;
        y = y+3;
    }
    public void show()
    {
        System.out.println("value of the x="+x);
        System.out.println("value of the y="+y);
    }
}
public class test6
{
    public static void main(String args[])
    {
        A1 a1 = new  A1(9);
        a1. show();
        A1 a2 = new A1();
        a2.show ();
        A1 a3 = new A1();
        a3.show();
        A1 a4 = new A1(5);
        a4.show();
    }
}