
public interface JmxAppExampleMBean {

    public String getStringAttr();
    public void setStringAttr(String str);
    public long getLongAttr();
    public java.lang.Long getLongObjAttr();
    public void callVoidMethod();
    public void callVoidWithSimpleArgs(String str, long num);
    public long callLongWithSimpleArgs();
    public long callLongObjWithSimpleArgs();
    public void callVoidWithMixedArguments(long num1, int num2, Long num3);

}

