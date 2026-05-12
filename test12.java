class multiply
{
    public multiply()
    {
        //consturctor
    }
    public void multi(int a,int b)
    {
       int s=a*b;
       System.out.println("Result1 :"+s);
    }
    public void multi(int a,int b,int c)
    {
        int s= a*b*c;
        System.out.println("Result2 :"+s);
    }
    public void multi(int a,int b,int c,int d)
    {
        int s=a*b*c*d;
        System.out.println("Result3 :"+s);
    }
}
public class test12
{
    public static void main(String args[])
    {
        multiply m1 = new multiply();
        m1.multi(2,3,4);
        m1.multi(34,1);
    }

}