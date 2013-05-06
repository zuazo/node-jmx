
public interface JmxAppExampleMBean {

    public String getStringAttr();
    public void setStringAttr(String stringAttr);
    public long getLongAttr();
    public void setLongAttr(long longAttr);
    public Long getLongObjAttr();
    public void setLongObjAttr(Long longObjAttr);
    public void callVoidMethod();
    public void callVoidWithSimpleArgs(String str);
    public long callLongWithSimpleArgs();
    public long callLongObjWithSimpleArgs();
    public void callVoidWithMixedArguments(long num1, int num2, Long num3);

}

