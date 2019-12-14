# Dependencies and Setup
import pandas as pd

# File to Load
file_to_load = "Resources/titanic.csv"

# Read Purchasing File and store into Pandas data frame
data = pd.read_csv(file_to_load)

data.head()