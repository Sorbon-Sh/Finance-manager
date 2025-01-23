const AppSider: React.FC = () => {
  return (
    <aside className=" col-start-1 col-end-4 bg-blue-200">
      <div>
        <span>Total amount on accounts</span>
        <span>How match</span>
      </div>
      <div>
        <div>
          <span>My accounts</span>
          <span>Edit</span>

          <div>
            <span>Account Name</span>, <span>money in account</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSider;
