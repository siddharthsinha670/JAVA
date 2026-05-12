class complex1
{
    public complex1()
    {
        //consturctor
    }
    public void comp(int a,int b)
    {

        System.out.println("the complex numbe is:"+a+"+"+b+"i");
    }
}
public class test13
{
    public static void main(String args[])
    {
        complex1 cp = new complex1();
        cp.comp(3,4);
        cp.comp(4,5);
    }
}