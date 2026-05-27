class A
{
    void show()
    {
        System.out.println("HELLO VIEWERS");
    }
}
class B extends A
{
    void show()
    {
        super.show();
        System.out.println("hello learner");
    }
}
class SuperDemo
{
    public static void main(String args[])
    {
        B r = new B();
        r.show();
    }
}