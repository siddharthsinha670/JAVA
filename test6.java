//static member
class A {
   static  private int x;
    private int y;
    public A()
    {
        x =1;
        y=y+2;
    }
    public A(int x1)
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
        A a1 = new  A(9);
        a1. show();
        A a2 = new A();
        a2.show ();
        A a3 = new A();
        a3.show();
        A a4 = new A(5);
        a4.show();
    }
}