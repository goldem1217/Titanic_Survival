# Dependencies and Setup
import pandas as pd

# File to Load (Remember to Change These)
file_to_load = "titanic.csv"

# Read Purchasing File and store into Pandas data frame
titanic_data = pd.read_csv(file_to_load)
titanic_data["fare"]=round(titanic_data["fare"],2)

# Class 1
titanic_data_1class =titanic_data.loc[titanic_data["pclass"]==1]
fare_group = pd.DataFrame(titanic_data_1class[["pclass","fare"]].groupby("fare").count())
fare_group.columns=["passengers"]

fare_group_survived = pd.DataFrame(round(titanic_data_1class[["survived","fare"]].groupby(["fare"]).mean()*100,2))
fare_group_survived.columns=["percentSurvived"]
fare_group=fare_group.merge(fare_group_survived,on="fare")
fare_group.to_csv("peopleByFareClass1.csv")

# Class 2
titanic_data_2class =titanic_data.loc[titanic_data["pclass"]==2]
fare_group2 = pd.DataFrame(titanic_data_2class[["pclass","fare"]].groupby("fare").count())
fare_group2.columns=["passengers"]

fare_group_survived2 = pd.DataFrame(round(titanic_data_2class[["survived","fare"]].groupby(["fare"]).mean()*100,2))
fare_group_survived2.columns=["percentSurvived"]
fare_group2=fare_group2.merge(fare_group_survived2,on="fare")
fare_group2.to_csv("peopleByFareClass2.csv")
print(fare_group2)

# Class 3
titanic_data_3class =titanic_data.loc[titanic_data["pclass"]==3]
fare_group3 = pd.DataFrame(titanic_data_3class[["pclass","fare"]].groupby("fare").count())
fare_group3.columns=["passengers"]

fare_group_survived3 = pd.DataFrame(round(titanic_data_3class[["survived","fare"]].groupby(["fare"]).mean()*100,2))
fare_group_survived3.columns=["percentSurvived"]
fare_group3=fare_group3.merge(fare_group_survived3,on="fare")
fare_group3.to_csv("peopleByFareClass3.csv")
print(fare_group3)