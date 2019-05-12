class CreatePermissions < ActiveRecord::Migration[8.0]
  def change
    create_table :permissions do |t|
      t.string :action

      t.timestamps
    end
    add_index :permissions, :action
  end
end
