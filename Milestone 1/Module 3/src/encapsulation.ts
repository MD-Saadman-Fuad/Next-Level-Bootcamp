class BankAccount {
  readonly userId: number;
  public userName: string;
  private _userBalance: number;

  constructor(userId: number, userName: string, userBalance: number) {
    this.userId = userId;
    this.userName = userName;
    this._userBalance = userBalance;
  }

  addBalance(amount: number): void {
    this._userBalance += amount;
  }

  get balance(): number {
    return this._userBalance;
  }
}

class StudentBankAccount extends BankAccount {
  constructor(userId: number, userName: string, userBalance: number) {
    super(userId, userName, userBalance);
  }
  addBonus() {
    this.addBalance(100);
  }
}

const account1 = new BankAccount(1, "Alice", 1000);
const account2 = new BankAccount(2, "Bob", 2000);
const studentAccount = new StudentBankAccount(3, "Charlie", 1500);


account1.addBalance(500);
account2.addBalance(1000);
studentAccount.addBonus();

console.log(account1.balance);
console.log(account2.balance);
console.log(studentAccount.balance);

