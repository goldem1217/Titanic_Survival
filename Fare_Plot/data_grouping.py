# Dependencies and Setup
import pandas as pd

# File to Load (Remember to Change These)
file_to_load = "titanic.csv"

# Read Purchasing File and store into Pandas data frame
titanic_data = pd.read_csv(file_to_load)
print(titanic_data.head())
titanic_data["fare"]=round(titanic_data["fare"],2)
titanic_data_1class =titanic_data.loc[titanic_data["pclass"]==1]
fare_group = pd.DataFrame(titanic_data_1class[["pclass","fare"]].groupby("fare").count())
fare_group.columns=["passengers"]

fare_group_survived = pd.DataFrame(round(titanic_data_1class[["survived","fare"]].groupby(["fare"]).mean()*100,2))
fare_group_survived.columns=["percentSurvived"]
fare_group=fare_group.merge(fare_group_survived,on="fare")
print(fare_group)
fare_group.to_csv("peopleByFareClass1.csv")